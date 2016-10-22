# name: discourse-blog-post

enabled_site_setting :blog_post_enabled

register_asset 'stylesheets/blog-post-styles.scss'

PLUGIN_NAME = 'discourse_blog_post'.freeze

after_initialize do

  module ::DiscourseBlogPost
    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace DiscourseBlogPost
    end
  end

  require_dependency 'application_controller'
  class DiscourseBlogPost::BlogPostController < ::ApplicationController

    def mark_as_blog_post
      post = Post.find(params[:id].to_i)

      post.custom_fields['is_blog_post'] = 'true'
      post.topic.custom_fields['blog_post_id'] = post.id

      post.save!
      post.topic.save!

      render json: success_json
    end

    def unmark_as_blog_post
      post = Post.find(params[:id].to_i)

      post.custom_fields['is_blog_post'] = nil
      post.topic.custom_fields['blog_post_id'] = nil

      post.save!
      post.topic.save!

      render json: success_json
    end
  end

  DiscourseBlogPost::Engine.routes.draw do
    post 'mark_as_blog_post' => 'blog_post#mark_as_blog_post'
    post 'unmark_as_blog_post' => 'blog_post#unmark_as_blog_post'
  end

  Discourse::Application.routes.append do
    mount ::DiscourseBlogPost::Engine, at: 'blog'
  end

  class ::Category
    after_save :reset_blog_post_cache

    protected
    def reset_blog_post_cache
      ::Guardian.reset_blog_post_cache
    end
  end

  class ::Guardian
    @@blog_post_cache = DistributedCache.new('blog_post_categories')

    def self.reset_blog_post_cache
      @@blog_post_cache['categories'] =
          begin
            Set.new(
                CategoryCustomField
                    .where(name: 'enable_blog_posts', value: 'true')
                    .pluck(:category_id)
            )
          end
    end

    def allow_blog_posts_in_category?(category_id)
      self.class.reset_blog_post_cache unless @@blog_post_cache['categories']
      @@blog_post_cache['categories'].include?(category_id)
    end
  end

  # Add the 'blog_posts_enabled' attribute to categories.
  require_dependency 'basic_category_serializer'
  class ::BasicCategorySerializer
    attributes :blog_posts_enabled

    def blog_posts_enabled
      scope && scope.allow_blog_posts_in_category?(object.id)
    end
  end


  TopicView.add_post_custom_fields_whitelister do |user|
    ['is_blog_post']
  end

  require_dependency 'topic_view_serializer'
  class ::TopicViewSerializer
    attributes :has_blog_post, :image_url

    def image_url
      object.image_url
    end

    def has_blog_post
      blog_post_id ? true : false
    end

    def blog_post_id
      id = object.topic.custom_fields['blog_post_id']

      id && id.to_i rescue nil
    end
  end

  require_dependency 'post_serializer'
  class ::PostSerializer
    attributes :is_blog_post

    def is_blog_post
      post_custom_fields['is_blog_post'] == 'true'
    end
  end

  TopicList.preloaded_custom_fields << 'blog_post_id' if TopicList.respond_to? :preloaded_custom_fields
end