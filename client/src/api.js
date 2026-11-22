// Sends JSON to the back end through Nginx (relative path, same origin).
// Returns { ok, status, data }. status 0 means the server could not be reached.
export async function postJSON(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return { ok: false, status: 0, data: {} };
  }
  let data = {};
  try {
    data = await res.json();
  } catch (err) {
    /* response had no JSON body */
  }
  return { ok: res.ok, status: res.status, data };
}
