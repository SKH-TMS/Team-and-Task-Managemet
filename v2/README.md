# Version 2

## Fixes from lasst repo

- Fixed some code of assigning tasks to the memers.

1. Before when the task was assigned in the "assigned_project_2_team" new versions of similer data were being created so i changed the code of updating the collection.
2. before there was error when assigning the task to a singular User, it was working fine when we are not specifing the user(it was assigned to all members if we didnot specify the member ). but when we specify the single user errors occured. So i fixed the code of the "assignTask/roue.ts" to fix it.

## Updation from last repo

- Added the functionality of the Team Member submitting the task assiged to him.
- After the submittion the Task status become "In Progress"
- Added code of following Pages in the **teamData** folder.

  **ProjectTasks**
  **TeamProjects**
  **ManageTasks**

- Added code of following routes in the **api/teamData** folder.

  1.  **submitTask/roue.ts**
  2.  **getTeamsforMembers/roue.ts**
  3.  **getTeamProjects/roue.ts**
  4.  **getProjectTasks/roue.ts**
  5.  **getTeamProjects/roue.ts**

## Incomplete Sections

The code of the "ManageTeam" section is still not completed, some functionalities of the TeamLeader are missing
