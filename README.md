# Team-and-Task-Managemet
## Version 0

### Updation from last repo

- Added the **UserRole** as an array in only the Token. Note that this change is not done in the database for best backward compateablilty.
- Added following Pages in the **teamData** folder.

  1. **NavbarTeam**
  2. **ProfileTeam**
  3. **ManageTasks**
  4. **ManageTeam**

- In the Profile of the Team the role of the user is shown this is a temperory solution just for testing can be removed in future.All other functionalities are similer to the Profile of a typical user
- In the Navbar of Team the if else is used to determine if the Role of the User is "TeamLeader", "TeamMember" or both. The conditional based Links are shown on the "NavbarTeam" simile to all other Navbars we have used so far.
- I also added the Validation Check for the Users related to team and not related to a team.

### Incomplete Sections

The code of **ManageTasks** and **ManageTeam** is not written till now.
## Version 1

### Updation from last repo

- Added the functionality of the Team Leader assigning the task to the team.
- If the assignment is unfilled the task will be assigned to every member of the team.
-
- Added code of following Page in the **teamData** folder.

  **ManageTeam**

- Added code of following routes in the **api/teamData** folder.

  1.  **assignTask/roue.ts**
  2.  **getProjects/roue.ts**
  3.  **getTeams/roue.ts**

### Incomplete Sections

THe code of **ManageTasks**is not written till now.
## Version 2

### Fixes from lasst repo

- Fixed some code of assigning tasks to the memers.

1. Before when the task was assigned in the "assigned_project_2_team" new versions of similer data were being created so i changed the code of updating the collection.
2. before there was error when assigning the task to a singular User, it was working fine when we are not specifing the user(it was assigned to all members if we didnot specify the member ). but when we specify the single user errors occured. So i fixed the code of the "assignTask/roue.ts" to fix it.

### Updation from last repo

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

### Incomplete Sections

The code of the "ManageTeam" section is still not completed, some functionalities of the TeamLeader are missing
## Version 3

### Updation from last repo

- Before all the Pages and routes of both TeamLeader and TeamMember ere in a single folder named trsmData.

- Now the pages and routes are in three sub sections of the TeamData.

1. data of the teamMember has been moved to teamData\teamMemberData

1. data of the teamLeader has been moved to teamData\teamLeaderData
   both routes and pages are inside the one respevtive folder of the teamrollr

### Incomplete Sections

The code of the "TeamMemberData" section is still not completed, some functionalities of the TeamLeader are missing but moslty design messages thore.
## Version 4

### Updation from last repo

Added some missing functionalities of the "TeamLeader" and "TeamMembers"

#### Crucial Error Fixing

- From the start these was a crucial error in the if of all collections it wasn't able to excede the value of 10 but when it did excede the value of two digits there were still some errors.
- to fix this error adeed the digits bounding of "5" zeros to the id of each collection now rather then starting from "1" they start from "00001".

### Incomplete Sections

1. Validation is not done till now
2. The code is also not development Ready

