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
    else if ($(this).attr("id") === "after-submit-alias-button") {
      goToPemesanan($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "add-review-button") {
      addReview($(this).attr("data-ref"));
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

// function completeOrder(orders) {
//   const final_orders = JSON.parse(orders);
//   var target = document.createElement("ul");
//   var button = document.createElement("button");

//   console.log(typeof(final_orders));

//   for (var i = 0; i < final_orders.length; i++){
//     console.log(final_orders[i].nama_hidangan);
//     var list = document.createElement("li");
//     var nama_hidangan = '';
//     var kuantitas = '';

//     list.setAttribute("class", "order-list");
//     list.setAttribute("data-ref", i);
//     list.setAttribute("id", "hidangan-" + i);
//     nama_hidangan = document.createTextNode(final_orders[i].nama_hidangan);
//     kuantitas = document.createTextNode(final_orders[i].kuantitas);

//     list.appendChild(nama_hidangan);
//     list.appendChild(document.createTextNode(" "));
//     list.appendChild(kuantitas);

//     target.appendChild(list);
//   }

//   console.log(ul)
//   button.setAttribute("id", "complete-order-button");
//   button.appendChild(document.createTextNode("Bayar"));

//   $(document.body).append(target);
// }

// function update_status_pemesanan(val) {
//     function editMenu(val) {
//       var x = document.getElementById("input-form_" + val);
//       if (x.style.display === "none") {
//         x.style.display = "block";
//       } else {
//         x.style.display = "none";
//       }
//   }

// }
