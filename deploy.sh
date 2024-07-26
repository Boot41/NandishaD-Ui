# Modify it to your github repo name e.g. http://github.com/boot41/<repo-name>
REPO_NAME=NandishaD-Ui

curl -X POST -H "Content-type: application/json" "https://cloudbuild.googleapis.com/v1/projects/think41-web/triggers/UI-Build:webhook?key=AIzaSyDkrV_ZK_pCE5vzSIBEgzLydqCpYoZhuUM&secret=57b45cf5-39f5-42cf-83b2-adca5ebbbf2b" -d "{\"substitutions\": {\"project\":\"$REPO_NAME\"}}"

# Running this triggers a Google Cloud Build job, that deploys ui to
# https://boot.think41.com/$REPO_NAME/
# e.g. # https://boot.think41.com/sample-ui/
# That should load index.html. You would need to ensure
# that the base path in vite.config.js is set correctly
# for the css and js to load as well.

# By default, the index.html file gets cached for an hour. 
# The other files are versioned so it shouldn't matter, but if you deploy
# quickly the easiest way to try newer version is to add a new random param
# to the query every time e.g.
# https://boot.think41.com/$REPO_NAME/?query=random-number

# PS: First time you access it, you would need to allow the HTTPS error
# as the SSL certificate isn't published yet.