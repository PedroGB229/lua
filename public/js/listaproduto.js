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
        url: '/produto/listproduto',
        type: 'POST'
    },
});

// --- LÓGICA DE ATALHOS ---
document.addEventListener('keydown', function (e) {
    
    // F2 - Ir para Cadastro
    if (e.key === 'F2') {
        e.preventDefault();
        window.location.href = '/produto/cadastro';
    }
});

async function Delete(id) {

    document.getElementById('id').value = id;

    const response = await Requests.SetForm('form').Post('/produto/delete');

    if (!response.status) {
        Swal.fire({
            title: "Erro ao remover!",
            icon: "error",
            html: response.msg,
            timer: 3000,
            timerProgressBar: true
        });
        return;
    }

    Swal.fire({
        title: "Removido!",
        icon: "success"
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
            title: "Produto nao encontrado!",
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
    console.log("salvar estoque chamado");
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
    tabela.ajax.reload(); // atualiza a tabela para refletir mudança
}

window.AjustarEstoque = AjustarEstoque;

window.SalvarEstoque = SalvarEstoque;
window.Delete = Delete;