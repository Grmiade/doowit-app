workflow "Deploy" {
  on = "push"
  resolves = ["GitHub Action for Zeit"]
}

action "Build & Deploy" {
  uses = "actions/zeit-now@9fe84d5"
  args = "deploy"
  secrets = ["ZEIT_TOKEN"]
}

action "GitHub Action for Zeit" {
  uses = "actions/zeit-now@9fe84d5"
  needs = ["Build & Deploy"]
  secrets = ["ZEIT_TOKEN"]
  args = "alias"
}
