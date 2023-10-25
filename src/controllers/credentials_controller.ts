
export const credentialsIndex = ({ credentialsDb }) => {
  const credentials = credentialsDb().all()
  const tranformedCredentials = credentials.map((credential) => {
    return {
      "id" : credential.id,
      "projectId" : credential.project_id,
      "apiUrl" : credential.api_url,
      "privateToken" : credential.private_token
    }
  })
  return {
    credentials: tranformedCredentials
  }
}

export const credentialsCreate = ({ credentialsDb, body }) => {
  console.log('Controller: Creating credential', body)
  const newCredentials = {
    project_id: body.projectId,
    api_url: body.apiUrl,
    private_token: body.privateToken
  }
  const id = credentialsDb().create(newCredentials)
  return {
    id
  }
}

export const credentialsDestroy = ({ credentialsDb, params }) => {
  const id =  parseInt(params.id)
  credentialsDb().destroy(id)
  return {
    id
  }
}

export const credentialsUpdate =  ({ credentialsDb, params, body }) => {
  console.log('Controller: Updating credential', body, params)
  const id = parseInt(params.id)
  const fieldsToUpdate = {
    project_id: body.projectId,
    api_url: body.apiUrl,
    private_token: body.privateToken
  }
  credentialsDb().update(id, fieldsToUpdate)
  return {
    id
  }
}