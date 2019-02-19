workflow "Deploy" {
  on = "push"
  resolves = ["Alias"]
}

action "Build & Deploy" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  args = "deploy"
  secrets = ["ZEIT_TOKEN"]
}

action "Alias" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  needs = ["Build & Deploy"]
  secrets = ["ZEIT_TOKEN"]
  args = "alias"
}
