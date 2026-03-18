<?php

namespace app\controller;

use app\database\builder\SelectQuery;

class AdjustmentStock extends Base
{

    public function lista($request, $response)
    {
        $dadosTemplate = [
            'titulo' => 'Lista de Produtos'
        ];
        return $this->getTwig()
            ->render($response, $this->setView('listadjustmentstock'), $dadosTemplate)
            ->withHeader('Content-Type', 'text/html')
            ->withStatus(200);
    }
    public function cadastro($request, $response)
    {
        try {
            $dadosTemplate = [
                'acao' => 'c',
                'titulo' => 'Cadastro'
            ];
            return $this->getTwig()
                ->render($response, $this->setView('adjustmentstock'), $dadosTemplate)
                ->withHeader('Content-Type', 'text/html')
                ->withStatus(200);
        } catch (\Exception $e) {
            var_dump($e);
        }
    }
    public function listajusteestoque($request, $response)
    {
        #Captura todas a variaveis de forma mais segura VARIAVEIS POST.
        $form = $request->getParsedBody();
        #Qual a coluna da tabela deve ser ordenada.
        $order = $form['order'][0]['column'];
        #Tipo de ordenação
        $orderType = $form['order'][0]['dir'];
        #Em qual registro se inicia o retorno dos registros, OFFSET
        $start = $form['start'];
        #Limite de registro a serem retornados do banco de dados LIMIT
        $length = $form['length'];
        $fields = [
            0 => 'id',
            1 => 'nome',
            3 => 'descricao_curta',
            2 => 'codigo_barra',
            4 => 'valor',
        ];
        #Capturamos o nome do campo a ser odernado.
        $orderField = $fields[$order];
        #O termo pesquisado
        $term = $form['search']['value'];
        $query = SelectQuery::select()->from('view_product');
        if (!is_null($term) && ($term !== '')) {
            $query
                ->where('id', 'ilike', "%{$term}%")
                ->where('nome', 'ilike', "%{$term}%", 'or')
                ->where('descricao_curta', 'ilike', "%{$term}%", 'or')
                ->where('codigo_barra', 'ilike', "%{$term}%", 'or')
                ->where('valor', 'ilike', "%{$term}%", 'or');        
        }
        $product = $query
            ->order($orderField, $orderType)
            ->limit($length, $start)
            ->fetchAll();
        $produtoData = [];
        foreach ($product as $key => $value) {
            $produtoData[$key] = [
                $value['id'],
                $value['nome'],
                $value['descricao_curta'],
                $value['codigo_barra'],
                $value['valor'],
                "<div class='d-flex gap-2'>
                    <button type='button' onclick='AjustarEstoque({$value['id']});' class='btn btn-info btn-sm px-2 shadow-sm' style='white-space: nowrap; font-weight: 500;'>
                        <i class='bi bi-plus-circle-fill'></i> Ajustar Estoque
                    </button>

                    <button type='button' onclick='Delete({$value['id']});' class='btn btn-danger btn-sm px-2 shadow-sm' style='white-space: nowrap; font-weight: 500;'>
                        <i class='bi bi-trash-fill'></i> Excluir
                    </button>
                </div>"
                ];
                }
                
                
                
            //<div class='d-flex gap-2'>
            // <a href='/produto/alterar/{$value['id']}' class='btn btn-warning btn-sm px-2 shadow-sm' style='white-space: nowrap; font-weight: 500;'>
            //   <i class='bi bi-pencil-square'></i> Alterar
            // </a>



                $data = [
            'status' => true,
            'recordsTotal' => count($product),
            'recordsFiltered' => count($product),
            'data' => $produtoData
        ];
        $payload = json_encode($data);

        $response->getBody()->write($payload);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }
}