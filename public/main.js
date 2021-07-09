const update = document.querySelector('#update-button')

// function submitEdit(val, menu_name) {
//   update.addEventListener('click', _ => {
//     fetch('/menu', {
//         method: 'put',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             nama: menu_name,
//             deskripsi: document.getElementById("update-deskripsi_" + val),
//             harga: document.getElementById("update-harga_" + val)
//         })
//     })
//   })
// }

$('button').each(function() {
  $(this).on('click', function() {
    if($(this).attr("id") === "edit-button") {
      editMenu($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "delete-button") {
      deleteMenu($(this).attr("data-name"));
    }
    else if ($(this).attr("id") === "increment-button") {
      increment($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "decrement-button") {
      decrement($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "order-button") {
      combineAndSendForms();
    }
    else if ($(this).attr("id") === "add-review-button") {
      addReview($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "send-review-button") {
      combineAndSendReviews();
    }
  })
});

function editMenu(val) {
    var x = document.getElementById("input-form_" + val);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

function addReview(val) {
  var x = document.getElementById("review-form_" + val);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function deleteMenu(val) {
  fetch('/menu', {
    method:'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nama: val
    })
  })
}

function increment(val) {
  document.getElementById('demoInput_' + val).stepUp();
}

function decrement(val) {
  document.getElementById('demoInput_' + val).stepDown();
}

function combineAndSendForms() {
  var form = document.createElement("form");
  var button = document.createElement("button");
  button.setAttribute("type", "submit")
  button.setAttribute("value", "submit")

  form.setAttribute("type", "submit")
  
  var inputs = document.querySelectorAll('input');
  var i;

  for(i = 0; i < inputs.length; i++) {
    var value = inputs[i].value;
    
    if(value > 0) {
      var input_hidangan = document.createElement("input");
      input_hidangan.setAttribute("type", "hidden");
      input_hidangan.setAttribute("name", "hidangan");
      input_hidangan.setAttribute("value", inputs[i].getAttribute('data-name'));
      input_hidangan.setAttribute("kuantitas", value);

      form.appendChild(input_hidangan);
    }
  }

  $(document.body).append(form);
 
  var pesanan = createJSON();

  sendRequest(pesanan);
}

function combineAndSendReviews() {
  var form = document.createElement("form");
  var button = document.createElement("button");
  button.setAttribute("type", "submit")
  button.setAttribute("value", "submit")

  form.setAttribute("type", "submit")
  
  var inputs = document.querySelectorAll('input');
  var i;

  for(i = 0; i < inputs.length; i += 4) {
    var hidangan = inputs[i].value;
    var rating = parseInt(inputs[i + 1].value);
    var nama = inputs[i + 2].value;
    var komentar = inputs[i + 3].value;
    
    if(rating > 0) {
      var input_hidangan = document.createElement("input");
      input_hidangan.setAttribute("type", "hidden");
      input_hidangan.setAttribute("name", "review");
      input_hidangan.setAttribute("value", hidangan);
      input_hidangan.setAttribute("rating", rating);
      input_hidangan.setAttribute("nama", nama);
      input_hidangan.setAttribute("komentar", komentar);

      form.appendChild(input_hidangan);
    }
  }

  $(document.body).append(form);
 
  var review = createReviewJSON();

  sendRequestReview(review)
}

function sendRequestReview(data) {
  var xhr = new XMLHttpRequest();
  var url = "/pemesanan";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
  };

  xhr.send(data);
}

function sendRequest(data) {
    var xhr = new XMLHttpRequest();
    var url = "/pemesanan";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
  };

  xhr.send(data);
}

function createJSON() {
  jsonObj = [];
  $("input[name=hidangan]").each(function() {

      var kuantitas = $(this).attr("kuantitas");
      var nama_hidangan = $(this).val();

      item = {}
      item ["nama_hidangan"] = nama_hidangan;
      item ["kuantitas"] = kuantitas;

      jsonObj.push(item);
  });

  return JSON.stringify(jsonObj);
}


function createReviewJSON() {
  jsonObj = [];
  $("input[name=review]").each(function() {

      var rating = $(this).attr("rating");
      var nama_hidangan = $(this).val();
      var nama = $(this).attr("nama");
      var komentar = $(this).attr("komentar");


      item = {}
      item ["nama-hidangan"] = nama_hidangan;
      item ["rating"] = parseInt(rating);
      if (nama != "") {
        item ["nama"] = nama;
      }
      if (komentar != "") {
        item ["komentar"] = komentar;
      }


      jsonObj.push(item);
  });

  return JSON.stringify(jsonObj);
}