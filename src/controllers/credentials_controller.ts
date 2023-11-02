
export const credentialsIndex = async ({ credentialsDb }) => {
  const credentials = await credentialsDb().all()
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

export const credentialsCreate = async ({ credentialsDb, body }) => {
  console.log('Controller: Creating credential', body)
  const newCredentials = {
    project_id: body.projectId,
    api_url: body.apiUrl,
    private_token: body.privateToken
  }
  const id = await credentialsDb().create(newCredentials)
  return {
    id
  }
}

export const credentialsDestroy = async ({ credentialsDb, params }) => {
  const id =  parseInt(params.id)
  await credentialsDb().destroy(id)
  return {
    id
  }
}

export const credentialsUpdate = async ({ credentialsDb, params, body }) => {
  console.log('Controller: Updating credential', body, params)
  const id = parseInt(params.id)
  const fieldsToUpdate = {
    project_id: body.projectId,
    api_url: body.apiUrl,
    private_token: body.privateToken
  }
  await credentialsDb().update(id, fieldsToUpdate)
  return {
    id
  }
}