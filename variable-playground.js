// var person = {
//     name: 'Goran',
//     age: 19
// };

// function updatePerson (obj) {
//     obj.age = 25;
//     obj.cat = "cat";
// }

// function objIter (obj) {
//     for (var property in obj) {
//         if (obj.hasOwnProperty(property)) {
//             console.log(obj[property]);
//         }
//     }
// }

// // updatePerson(person);
// objIter(person);
// console.log(person);

var grades = [2,5,1];

function addGrade (obj) {
    grades.push(6);
    
    obj = [10, 9, 8];
}

addGrade(grades);
console.log(grades);