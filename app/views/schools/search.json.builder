json.array!(@schools) do |school|
  json.id        school.id
  json.name      school.name
  json.state     school.state
end
