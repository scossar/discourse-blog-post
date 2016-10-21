# name: discourse-blog-post

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
      render json: success_json
    end

    def unmark_as_blog_post
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

  require_dependency 'category_serializer'
  class ::BasicCategorySerializer
    attributes :blog_posts_enabled

    def blog_posts_enabled
      scope.allow_blog_posts_in_category?(object.id)
    end
  end


end