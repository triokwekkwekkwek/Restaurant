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

  sendRequest(pesanan)
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
      item ["nama-hidangan"] = nama_hidangan;
      item ["kuantitas"] = kuantitas;

      jsonObj.push(item);
  });

  return JSON.stringify(jsonObj);
}
