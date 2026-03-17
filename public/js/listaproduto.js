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
        title: "Removido com sucesso!",
        icon: "success",
        html: response.msg,
        timer: 3000,
        timerProgressBar: true
    });
    tabela.ajax.reload();
}

async function AjustarEstoque(id) {
    try {
        console.log(`Abrindo modal para ID: ${id}`);
        document.getElementById('id').value = id;
        document.getElementById('nova_quantidade').value = '';
        document.getElementById('quantidade_atual').value = 'Carregando...';
        const response = await Requests.SetForm('form').Post('/produto/selecionarestoque');

        if (response && response.status) {
            document.getElementById('quantidade_atual').value = response.estoque_atual;

            $('#modalstock').modal('show');
        } else {
            console.error("Erro na resposta do servidor:", response);
            Swal.fire("Erro", "Produto não encontrado ou sem saldo.", "error");
        }
    } catch (error) {
        console.error("Erro ao abrir modal:", error);
    }
}

async function NovaQuantidade() {
    const response = await Requests.SetForm('form').Post('/produto/selecionarestoque');

    if (response.status) {
        Swal.fire({
            title: "Sucesso!",
            text: response.msg,
            icon: "success",
            timer: 2000
        });

        $('#modalstock').modal('hide');
        tabela.ajax.reload();
    } else {
        Swal.fire("Erro", response.msg, "error");
    }
}

// IMPORTANTE: Expor para o window porque o DataTables renderiza o HTML dinamicamente
window.AjustarEstoque = AjustarEstoque;
window.NovaQuantidade = NovaQuantidade;
window.Delete = Delete;