# What is it about?

This is a local dashboard to generate insights on GitLab data.

# Tech Stack

* Bun 1.0.6
* Nodejs 16.10.0 or greater
* Sqlite 3
* Typescript and Javascript

# Frameworks

* Elysia web framework
* React library for web
* Tailwind CSS framework
* Nodemon is a utility to automatically restart your server

# Requirements

This project require that you have **nodejs** installed **v16.19.0 or greater**.

# How to run the project?

Execute the following commands:

```
# install bun
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.6"
# reload your PATH
source ~/.zshrc
# install dependencies
bun install
# run the application
bun dev.js
```

# Credentials

You need to set private token, project id and base url to use the application

## Project Id
The project id id located right on top of the GitLab page of your repo as the image below indicates:

![ProjectID](gitlab-project-id.png)

## Base Url
If you use GitLab cloud this is the base url: https://gitlab.com/api/v4, if you uses an on premises solution contact your GitLab admin.

## Private token
Get your private token at this page: https://gitlab.com/-/profile/personal_access_tokens

## CI notification feature
You can get notified when CI have finished to run by running the following command:
```
ci_ping_me $pipelineId
```
Replace the $pipelineId by the Id of your pipeline

You can also not provide an $pipelineId and `ci_ping_me` will try to find the pipeline that is running where you are the author, if there are more than one it will ask for the $pipelineId, but if there is just one pipeline is is going to track this one.

You can also track individual jobs, so you can provide an $jobId to the folliwing flag:
```
ci_ping_me --trace-job=$jobId
# or
ci_ping_me -j=$jobId
```

## Peferences configuration
Copy the the the `.env.sample` to the root folder, and rename the copy to `.env`.
You may find the follow preferences available:

* NOTIFICATION_SOUND_ID that is the audio notification that the application is going to use. There are a few options in the `audio` folder you may choose the one that you most like by usinsg number in the file name as value to this variable.
  e.g. to play audio/notification-v2.mp3 set NOTIFICATION_SOUND_ID=2