module.exports = {
  apps : [{
    name: 'todo-server',
    script: 'dist/main.js',
    env: {
      port: 3000,
      STAGE: "dev"
    },
    env_prod: {
      port: 80,
      STAGE: "prod"

    }

  }],

  
};
