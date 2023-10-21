
export const credentialsIndex = ({ credentialsDb }) => {
  const credentials = credentialsDb().all()
  return {
    credentials
  }
}

export const credentialsCreate = ({ credentialsDb, body }) => {
  const newCredentials = {
    project_id: body.project_id,
    api_url: body.api_url,
    private_token: body.private_token
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
  const id = parseInt(params.id)
  const fieldsToUpdate = {
    project_id: body.project_id,
    api_url: body.api_url,
    private_token: body.private_token
  }
  credentialsDb().update(id, fieldsToUpdate)
  return {
    id
  }
}