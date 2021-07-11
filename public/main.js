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
      sendThankyou();
    }
    // else if($(this).attr("id") === "review-button") {
    //   showReview($(this).attr("data-ref"));
    // }
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

// function showReview(val) {
//   fetch('/review', {
//     method:'get',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       nama_hidangan: val
//     })
//   })
// }

function increment(val) {
  document.getElementById('demoInput_' + val).stepUp();
}

function decrement(val) {
  document.getElementById('demoInput_' + val).stepDown();
}

function combineAndSendForms() {
  var form = document.createElement("form");
  var button = document.createElement("button");
  button.setAttribute("type", "submit");
  button.setAttribute("value", "submit");

  form.setAttribute("type", "submit");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "/pemesanan");
  
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
  sendRequest("/pemesanan", pesanan);
  orderpayment(pesanan);
}

function orderpayment(list_order) {
  orders = JSON.parse(list_order);

  var div =  document.getElementById("order-list");
  var ul = document.createElement("ul");
  var button = document.createElement("button");

  for(var i = 1; i < orders.length; i++) {
    var list = document.createElement("li");
    var nama_hidangan = document.createTextNode(orders[i].nama_hidangan);
    var kuantitas = document.createTextNode(orders[i].kuantitas);

    list.setAttribute("class", "detail=order");
    list.appendChild(nama_hidangan);
    list.appendChild(document.createTextNode("    "));
    list.appendChild(kuantitas);

    ul.appendChild(list);
  }

  button.appendChild(document.createTextNode("Bayar"));
  button.setAttribute("id", "payment-button");
  button.setAttribute("type", "submit");
  button.setAttribute("onclick", "pemesananStatusUpdate(orders)");

  div.appendChild(ul);
  div.appendChild(button);
  $(document.body).append(div);
}

function pemesananStatusUpdate(order_details) {
  var details = JSON.stringify(order_details);
  console.log(alias_name);
  var form = document.createElement("form");
  var button = document.createElement("button");
  var input = document.createElement("input");

  form.setAttribute("action", "/cek_status_pembayaran");
  form.setAttribute("method", "POST");
  button.setAttribute("type", "submit");
  button.appendChild(document.createTextNode("Cek Status pembayaran"));
  input.setAttribute("type", "hidden");
  input.setAttribute("nama", "nama");
  input.setAttribute("value", order_details[0].alias_name);

  form.appendChild(input);
  form.appendChild(button);
  $(document.body).append(form);

  sendRequest("/order-payment", details);
  sendRequest("/cek_status_pembayaran", details);
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

function sendRequest(target, data) {
    var xhr = new XMLHttpRequest();
    var url = target;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
  };

  xhr.send(data);
}

function sendThankyou() {
  swal("Terima kasih!", "Review yang anda tinggalkan sangat berharga bagi kami!", "success");
}

function createJSON() {
  jsonObj = [];
  alias_name = {};
  alias_name ["alias_name"] = createAlias();

  jsonObj.push(alias_name);
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
function createAlias() {
  const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}