class SchoolsController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json { @schools = School.search(params[:term]) }
    end
  end
end
