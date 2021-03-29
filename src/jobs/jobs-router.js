const path = require('path');
const express = require('express');
const xss = require('xss'); 
const JobsService = require('./jobs-service');

const jobsRouter = express.Router();
const jsonParser = express.json();

const serializeJob = job => ({
  id: jobs.id,
  modified: job.modified,
  name: xss(job.name),
  folderId: job.folderId,
  content: xss(job.content),
})

jobsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    JobsService.getAllJobs(knexInstance)
      .then(jobs =>{
        res.json(jobs)
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const { name, folderId, content } = req.body
    const newJob = { name, folderId, content }

    for (const [key, value] of Object.entries(newJob)) {
      if (value == null) {
             return res.status(400).json({
               error: { message: `Missing '${key}' in request body` }
             })
           }
         }

    JobsService.insertJob(
      req.app.get('db'),
      newJob
    )
      .then(job => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${job.id}`))
          .json(serializeJob(job));
      })
      .catch(next);
  });

jobsRouter
  .route('/:job_id')
  .all((req, res, next) => {
         JobsService.getJobById(
           req.app.get('db'),
           req.params.job_id
         )
           .then(job => {
             if (!job) {
               return res.status(404).json({
                 error: { message: `Job doesn't exist` }
               })
             }
             res.job = job // save the job for the next middleware
             next() 
           })
           .catch(next)
       })
        .get((req, res, next) => {
         res.json(serializeJob(res.job))
  })
  .delete((req, res, next) => {
    JobsService.deleteJob(
           req.app.get('db'),
           req.params.job_id
         )
           .then(numRowsAffected => {
             res.status(204).end()
           })
           .catch(next)
       })
  .patch(jsonParser, (req, res, next) => {
        const { name, folderId, content } = req.body
        const jobToUpdate = { id, name, folderId, content }
    
        const numberOfValues = Object.values(jobToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
          return res.status(400).json({
            error: {
              message: `Request body must content either 'name', 'folderId' or 'content'`
            }
          })
    
        JobsService.updateJob(
          req.app.get('db'),
          req.params.job_id,
          jobToUpdate
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
        })

module.exports = jobsRouter