class Job{
    static jobCount
    static jobForm = document.getElementById("createJobForm")
    static jobList = []
    constructor(name, points, isServer){
        this.name = name
        this.points = points
        this.isServer = isServer
        this.jobID = "job"+Job.jobCount
        Job.jobCount++
    }
    static jobExists(name, points, isServer){
        Job.jobList.forEach(job => {
            if(name===job.name&&points===job.points&&isServer===job.isServer)
            return false
        })
        return true
    }
    equalTo(otherJob){
        return Object.keys(this).every(key => this[key]===otherJob[key])
    }
}