const JobsService = {
    getAllJobs(knex){
      return knex.select('*').from('jobs');
    },
  
    insertJob(knex, newJob){
      return knex
        .insert(newJob)
        .into('jobs')
        .returning('*')
        .then(rows => {
          return rows[0];
        });
    },
  
    getJobById(knex, id) {
      return knex
        .from('jobs')
        .select('*')
        .where('id', id)
        .first();
    },
  
    deleteJob(knex, id){
      return knex('jobs')
        .where({ id })
        .delete(); 
    },
  
    updateJob(knex, id, newJobFields){
      return knex('jobs')
        .where({ id })
        .update(newJobFields);
    },
  };
  
  module.exports = JobsService;