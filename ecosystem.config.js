module.exports = {
  apps : [{
    name: 'todo-server',
    script: 'dist/main.js',
    env: {
      STAGE: "dev"
    },
    env_prod: {
      STAGE: "prod"
    }

  }],

  
};
