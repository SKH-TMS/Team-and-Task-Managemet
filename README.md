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
