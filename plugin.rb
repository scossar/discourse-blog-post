# name: discourse-blog-post
# about: Style a Discourse post as a blog post
# version: 0.2.1
# authors: scossar
# url: https://github.com/scossar/discourse-blog-post

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
    attributes :is_blog_post, :can_create_blog_post, :allow_blog_posts_in_category, :image_url

    def image_url
      topic = (topic_view && topic_view.topic) || object.topic
      topic.image_url
    end

    def is_blog_post
      post_custom_fields['is_blog_post'] == 'true'
    end

    def can_create_blog_post
      allowed_groups = SiteSetting.blog_post_allowed_groups.split('|')
      current_user = scope.current_user.present? ? scope.current_user : nil
      topic = (topic_view && topic_view.topic) || object.topic

      unless current_user && (current_user.id == topic.user_id || current_user.admin)
        return false
      end

      current_user.groups.each do |group|
        return true if allowed_groups.include?(group.name)
      end

      false
    end

    def allow_blog_posts_in_category
      allowed_categories = SiteSetting.blog_post_allowed_categories.split('|')
      topic = (topic_view && topic_view.topic) || object.topic

      allowed_categories.include? topic.category.name
    end
  end

  require_dependency 'topic_list_item_serializer'
  class ::TopicListItemSerializer
    attributes :has_blog_post

    def has_blog_post
      object.custom_fields['blog_post_id'] ? true : false
    end
  end

  TopicList.preloaded_custom_fields << 'blog_post_id' if TopicList.respond_to? :preloaded_custom_fields
end
