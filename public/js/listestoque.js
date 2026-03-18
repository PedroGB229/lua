import { Requests } from "./Requests.js";
const tabela = new $('#tabela').DataTable({
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true,
    stateSave: true,
    select: true,
    processing: true,
    serverSide: true,
    language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/pt-BR.json',
        searchPlaceholder: 'Digite sua pesquisa...'
    },
     ajax: {
        url: '/ajusteestoque/listajusteestoque',
        type: 'POST'
    },
    columnDefs: [
        {
            targets: [4],
            render: function (data, type, row) {
                if (type === 'display') {
                    return parseFloat(data).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });
                }
                return data;
            }
        }
    ]
    
});


async function Delete(id) {
    document.getElementById('id').value = id;
    const response = await Requests.SetForm('form').Post('/ajusteestoque/delete');
    if (!response.status) {
        Swal.fire({
            title: "Erro ao remover!",
            icon: "error",
            html: response.msg,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        return;
    }
    Swal.fire({
        title: "Removido com sucesso!",
        icon: "success",
        html: response.msg,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    tabela.ajax.reload();
}

async function AjustarEstoque(id) {
    console.log(`AjustarEstoque - ID: ${id}`);
    document.getElementById('id').value = id;

    const response = await Requests
        .SetForm('form')
        .Post('/produto/selecionarestoque');

    if (!response.status) {
        Swal.fire({
            title: "Produto não encontrado!",
            icon: "error",
            html: response.msg,
            timer: 3000,
            timerProgressBar: true
        });
        return;
    }

    document.getElementById('quantidade_atual').value = response.estoque_atual;
    $('#modalstock').modal('show');
    document.getElementById('nova_quantidade').focus();
}

async function SalvarEstoque() {
    console.log("SalvarEstoque chamado");

    const response = await Requests.SetForm('form').Post('/produto/alterarestoque');

    if (!response.status) {
        Swal.fire({
            title: "Erro ao atualizar estoque!",
            icon: "error",
            html: response.msg,
            timer: 3000,
            timerProgressBar: true
        });
        return;
    }

    Swal.fire({
        title: "Estoque atualizado!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true
    });

    $('#modalstock').modal('hide');
    tabela.ajax.reload();
}

window.Delete = Delete;
window.AjustarEstoque = AjustarEstoque;
window.SalvarEstoque = SalvarEstoque;     