export const modules = [
  {
    "description": "Parent folder for project",
    "id": 0,
    "name": "Project folder",
    "project_id": 1,
    "type": "folder"
  },
  {
    "description": "Module module1 description",
    "id": 1,
    "name": "module1",
    "project_id": 1,
    "parent": 0,
    "type": "module"
  },
  {
    "description": "Module module2 description",
    "id": 2,
    "name": "module2",
    "project_id": 1,
    "parent": 0,
    "type": "module"
  },
  {
    "description": "Module module3 description",
    "id": 3,
    "name": "module1",
    "project_id": 1,
    "parent": 0,
    "type": "module"
  },
  {
    "description": "Module module3 description",
    "id": 3,
    "name": "module1",
    "project_id": 1,
    "parent": 2,
    "type": "module"
  },
]

export const people = [{
  id: 1,
  name: "Managing Director",
  people: [
    {
      id: 2,
      name: "Sales Director"
    }, {
      id: 3,
      name: "IT Director",
      people: [
        {
          id: 4,
          name: "Technical Lead",
          people: [
            {
              id: 5,
              name: "Software Developer"
            },
            {
              id: 6,
              name: "Support Technician"
            }
          ]
        }
      ]
    }, {
      id: 7,
      name: "HR Department",
      people: [
        {
          id: 8,
          name: "HR Officer",
          people: [{
            id: 9,
            name: "HR Assistant 1"
          }, {
            id: 10,
            name: "HR Assistant 2"
          }]
        }
      ]
    }
  ]
}];
