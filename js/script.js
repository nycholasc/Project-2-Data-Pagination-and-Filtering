/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering

For assistance:
   Check out the "Project Resources" section of the Instructions tab: https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
   Reach out in your Slack community: https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2
*/
const itemsPerPage = 9;
const maxWordsToSearch = 5;
let currentPage = 1;


/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
*/
function showPage(list, page) {
   //-- Reset deafult html
   let studentUL = document.querySelector("ul.student-list");
   studentUL.innerHTML = "";   
   
   if (list.length == 0) {
      studentUL.innerHTML = `<p>0 students found.</p>`;   
   }
   else {
      //-- Limit page range
      page = Math.max(page, 1);
      page = Math.min(page, Math.ceil(list.length / itemsPerPage));
      currentPage = page;
      
      //-- Define variables
      let startIndex = (page * itemsPerPage) - itemsPerPage;
      let endIndex = Math.min(page * itemsPerPage, list.length);

      //-- Reorder parsed data by highest search rank
      list.sort((a, b) => {
         let aRank = a.hasOwnProperty("searchRank") ? a.searchRank : 0;
         let bRank = b.hasOwnProperty("searchRank") ? b.searchRank : 0;
         return (aRank > bRank) ? -1 : 1;
      });

      //-- Loop through page items
      for (let index = startIndex; index < endIndex; index++) {
         const userData = list[index];
         studentUL.innerHTML += `<li class="student-item cf" data-rank="${ userData.searchRank }">
                                    <div class="student-details">
                                       <img class="avatar" src="${ userData.picture.large }" alt="Profile Picture">
                                       <h3>${ userData.name.first } ${ userData.name.last }</h3>
                                       <span class="email">${ userData.email }</span>
                                    </div>
                                    <div class="joined-details">
                                       <span class="date">Joined ${ userData.registered.date }</span>
                                    </div>
                                 </li>`;
            
         
      }
   }
   
   //-- pagination to page
   addPagination(list);
}



/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/
function addPagination(list) {
   //-- Reset deafult html
   let paginationUL = document.querySelector("ul.link-list");
   paginationUL.innerHTML = "";  

   //-- Only show buttons if we exceed the page amount
   if (list.length > itemsPerPage) {
      let numberOfPages = Math.ceil(list.length / itemsPerPage);
      for (let index = 0; index < numberOfPages; index++) {
          //-- Create li dom obj
          let liObj = document.createElement('li');
         
         //-- Create button dom obj
         let liButton = document.createElement('button');
         if (index + 1 == currentPage) liButton.className = "active";
         liButton.innerText = index + 1;
         liButton.addEventListener("click", (e) => {
            showPage(list, parseInt(e.target.innerText));
         });
         
         //-- Put together
         liObj.appendChild(liButton);
         paginationUL.appendChild(liObj);
      }
   }

}



/**
 * Make and insert the search input then create the page 
 */
function makeSearch(list) {
   //-- Create and append search to header 
   let headerObj = document.querySelector("header");
   headerObj.innerHTML += `<label for="search" class="student-search">
                              <span>Search by name</span>
                              <input id="search" placeholder="Search by name...">
                              <button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>
                           </label>`;

   //-- Assign event to header 
   headerObj.addEventListener('input', (e) => {
      if (e.target.id == "search") {
         if (e.target.value.trim().length == 0) {
            showPage(list, 1);
            return;
         }

         let inputVals = e.target.value.split(' ');
         let parsedData = [];

         //-- Loop through all students
         for (let index = 0; index < list.length; index++) {

            //-- Loop through each word in a search
            for (let word = 0; word < Math.min(inputVals.length, maxWordsToSearch); word++) {
               const userData = list[index];
               const inputText = inputVals[word].toLowerCase();
               
               //-- Make sure text has value before matching
               if (inputText.trim().length > 0) {

                  //-- Add search rank if first name matches
                  if (userData.name.first.toLowerCase().indexOf(inputText) >= 0) {
                     parsedData = addSearchRank(parsedData, userData, inputText.length);
                  }

                  //-- Add search rank if last name matches
                  if (userData.name.last.toLowerCase().indexOf(inputText) >= 0) {
                     parsedData = addSearchRank(parsedData, userData, inputText.length);
                  }
               }
            }
         }

         //-- Show first page when input changes
         showPage(parsedData, 1);
      }
   });

   //-- Show normal page at first
   showPage(data, 1);
}


/**
 * Check if user data exists within parsed data, add if not
 * Also +1 to search rank so we can sort by most relevant later
 * @returns {Array}
 */
function addSearchRank(parsedData, userData, amount) {
   //-- Create a blank index to maybe push later
   let dataIndex = -1;
   
   //-- Loop through data to check for matching content
   for (let index = 0; index < parsedData.length; index++) {
      //-- Make sure our data list has the correct properties
      if (parsedData[index].hasOwnProperty("email") && parsedData[index].hasOwnProperty("registered")) {
         //-- Check if data already exists
         if (parsedData[index].email == userData.email && parsedData[index].registered.date == userData.registered.date) {
            dataIndex = index;
         }
      }
   }

   //-- Push new filtered student
   if (dataIndex == -1) {
      parsedData.push(userData);
      dataIndex = parsedData.length - 1;
      parsedData[dataIndex]["searchRank"] = 0;
   }

   //-- Update rank property
   parsedData[dataIndex]["searchRank"] += amount;


   return parsedData;
}


// Call functions
makeSearch(data);