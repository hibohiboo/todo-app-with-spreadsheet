import path from 'path'
import { google } from 'googleapis'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const sheets = google.sheets('v4')

export async function execAPI(spreadsheetId, range) {
  const auth = await google.auth.getClient({
    keyFile: path.join(__dirname, 'serviceAccountKey.json'),
    scopes: SCOPES,
  })

  const apiOptions = {
    auth,
    spreadsheetId,
    range,
  }
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(apiOptions, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      console.log(res.data.values)
      resolve(res.data.values)
    })
  })
}
