document.addEventListener("DOMContentLoaded",function(){
     const searchButton=document.getElementById("search-btn");
     const usernameInput=document.getElementById("user-input");
     const statsContainer=document.querySelector(".stats-container");
     const easyProgressCircle=document.querySelector(".easy-progress");
     const mediumProgressCircle=document.querySelector(".medium-progress");
     const hardProgressCircle = document.querySelector(".Hard-progress");

const easyLabel = document.getElementById("easy-label");
const mediumLabel = document.getElementById("medium-label");
const hardLabel = document.getElementById("Hard-label");
const cardStatsContainer = document.querySelector(".stats-cards");

     //return true or false based on regex
    function validateUsername(username){
        if(username.trim()===""){
           alert("Username should not be empty");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;

    }


    async function fetchUserDetails(username){
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;

            //alga username dalne k baad phle wala data ko hide krega
            // statsContainer.style.setProperty("display");

            const proxyUrl= "https://cors-anywhere.herokuapp.com/";
            const targetUrl = "https://leetcode.com/graphql/";
        const myHeaders = new Headers();

        myHeaders.append("content-type", "application/json");

        const graphql = JSON.stringify({
            query: `
                query userSessionProgress($username: String!) {

                    allQuestionsCount {
                        difficulty
                        count
                    }

                    matchedUser(username: $username) {

                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }

                            totalSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `,
            
            variables: { "username": username }
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
        };


            const response = await fetch(proxyUrl+targetUrl, requestOptions);

            if(!response.ok){
                throw new Error("Unable to process");
            }
            const parsedata=await response.json();
            console.log("Logging data:",parsedata);

            // data ko UI means screen pr dikhana chahti hu means ye av console m dikha rha hai 

            displayUserData(parsedata);
            console.log(parsedata.errors);
             console.log(parsedata.data.matchedUser);

        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}</p>`
        }
        finally{
          searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    //dekho yaha pr percentage ye sb nikalenge kisse circle m dikhai dega ki kitna ques solve kiye ho like a bar graph ki trh

    function updateProgress(solved,total,label,circle){
         const progressDgree=(solved/total)*100;
        //  ye circle m property set ho jayega kisse percentage pta chlega
         circle.style.setProperty("--progress-degree",`${progressDgree}%`);
        //yaha ab chahiye ki kitna ques solved hai by kitna total
        label.textContent=`${solved}/${total}`;

    }
     
    
    function displayUserData(parsedata){
    //     // hme sara data chahiye sare cirle ka ki kis circle m kitne questions hai
    if (!parsedata.data.matchedUser) {
    statsContainer.innerHTML = "<p>User not found</p>";
    return;
}
        const totalques=parsedata.data.allQuestionsCount[0].count;
        const totalEasyques=parsedata.data.allQuestionsCount[1].count;
        const totalMediumques=parsedata.data.allQuestionsCount[2].count;
        const totalHardques=parsedata.data.allQuestionsCount[3].count;

        const solvedTotalQues=parsedata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQues=parsedata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumQues=parsedata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQues=parsedata.data.matchedUser.submitStats.acSubmissionNum[3].count;

        // yaha progress wala function call ho rha hair sare type of question ko track krne k liye 

        updateProgress(solvedEasyQues,totalEasyques,easyLabel,easyProgressCircle);
        updateProgress(solvedMediumQues,totalMediumques,mediumLabel,mediumProgressCircle);
        updateProgress(solvedHardQues,totalHardques,hardLabel,hardProgressCircle);


        const cardData=[
            {label:"Overall Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            {label:"Overall Easy Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            {label:"Overall Medium Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            {label:"Overall Hard Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions }
        ];
        console.log("card data:",cardData);
        cardStatsContainer.innerHTML=cardData
        .map(
            data=>

                   `<div class="card">
                   <h4>${data.label}</h4>
                   <p>${data.value}</p>
                   </div>                
                `
        ) .join("");

    }

    
    searchButton.addEventListener('click', function(){
        const username=usernameInput.value;
        console.log("logging username:",username);
        if(validateUsername(username)){
           fetchUserDetails(username);
        }

    })
})