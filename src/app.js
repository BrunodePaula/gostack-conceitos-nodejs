const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;
  const idExists = repositories.find(repository=>repository.id===id);

  if(!idExists){
    return response.status(400).json({error: "Repository doesn't exist"})
  }
  return next();
}

app.use("/repositories/:id", validateRepositoryId)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body

  const repository = repositories.find(repository => repository.id === id)
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  const repositoryUpdate = {
    ...repository,
    title,
    url,
    techs
  }
  repositories[repositoryIndex] = repositoryUpdate;
  response.json(repositoryUpdate)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repository < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const repositoryUpdate = {
    ...repository,
    likes: repository.likes +1, 
  }
  repositories[repositoryIndex] = repositoryUpdate;
  response.json(repositoryUpdate);
});

module.exports = app;
