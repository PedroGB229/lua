import { Requests } from "./Requests.js";

const Salvar = document.getElementById('salvar');
const Action = document.getElementById('acao');

async function insert() {
    const response = await Requests.SetForm('form').Post('/produto/insert');
    if (!response.status) {
        Swal.fire({
            icon: "error",
            title: response.msg,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        return;
    }
    document.getElementById('acao').value = 'e';
    //Setamos o valor do campos ID para que se necessário alterar o registro
    document.getElementById('id').value = response.id;

    history.pushState(`/produto/alterar/${response.id}`, '', `/produto/alterar/${response.id}`);
    Swal.fire({
        icon: "success",
        title: response.msg,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}
async function update() {
    const response = await Requests.SetForm('form').Post('/produto/update');
    if (!response.status) {
        Swal.fire({
            icon: "error",
            title: response.msg,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        return;
    }
    Swal.fire({
        icon: "success",
        title: response.msg,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}
if (Salvar) {
    Salvar.addEventListener('click', () => {
        if (Action.value === 'c') {
            insert();
        } else {
            update();
        }
    });
}