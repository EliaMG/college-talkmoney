Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'home#index'

  get "/schools/search" => 'schools#search'
  get "schools/getschools" => 'schools#getschools'
  get 'schools/user_input' => "schools#user_input"

end
