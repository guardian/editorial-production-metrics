#Editorial Tools play template

This is a dump of all the files that made up atom-workshop before we started adding specific functionality. With a minimal amount of work, you should be able to take these files and, with a few global find and replace operations, have a project with:

 - Cloudformation template
 - Logging to logs.gutools via kinesis
 - Riffraff deploy and AMI update
 - Styles from https://github.com/guardian/tools-boilerplate
 - Webpack
 - Nginx config (set up for port 9050)
 - Configuration magic setup - config in the flexible-config Dynamo table. (you'll need to add your own local config file to s3://guconf-flexible/yourapp/yourapp.conf for local config)
 - Compile time dependency injection in line with https://github.com/guardian/recommendations/blob/master/scala.md

Modifying this project for your own needs should just involve some case sensitive global find and replace operations:

 - atom-workshop becomes your-app-name
 - atomworkshop becomes yourdomainname (only in nginxconfig)
 - AtomWorkshop becomes YourAppName
 - Atom Workshop becomes Your App Name

A global find for 'workshop' should let you know whether you've got everything!

## Running locally

You'll need the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed, and credentials
for the composer AWS account from [janus](https://janus.gutools.co.uk). You'll also need to follow the
'Install SSL certificates' step in the [dev-nginx readme](https://github.com/guardian/dev-nginx). Then:

 - Fetch config from S3: `./fetch-config.sh`
 - Setup the nginx mapping by following the instructions in the
 [dev-nginx readme](https://github.com/guardian/dev-nginx#install-config-for-an-application).
 - Install Client Side Dependencies with `./setup.sh`
 - Run using sbt: `sbt "run 9050"`. (For quick restart you should run `sbt` and then `run 9050`, so that you can exit
  the application without exiting sbt.)
  
## Compiling Client Side Dependencies

You can compile client side dependencies with `yarn build` or `npm run build`. 
Alternatively to compile client side assets on change run `yarn build-dev` or `npm run build-dev`

