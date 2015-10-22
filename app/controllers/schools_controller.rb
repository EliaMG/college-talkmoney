class SchoolsController < ApplicationController
  def search
    @schools = School.school_search(params[:term], params[:years])
    respond_to do |format|
      format.html
      format.json { render json: @schools.select('id', 'name', 'state') }
    end
  end
end
