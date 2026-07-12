export function match_snapShot({matchState}) {
    if (typeof matchState != "object" ) return
    const data = JSON.parse(localStorage.getItem("snapShot")) || []
    data.push(matchState)
    localStorage.setItem("snapShot",JSON.stringify(data))
}

export function removePrevBall_snapshot(){
    const data = JSON.parse(localStorage.getItem("snapShot")) || []
    data.pop()
    localStorage.setItem("snapShot",JSON.stringify(data))
}