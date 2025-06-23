'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation"
import httpClient from "../../utils/httpClient";

export default function FormProduto({ produto }) {

    const nome = useRef();
    const descricao = useRef();
    const id_categoria = useRef();
    const marca = useRef();
    const preco = useRef();
    const quantidade = useRef();
    const data_validade = useRef();
    const id_fornecedor = useRef();
    const imagens = useRef();
    const status_web = useRef();
    const ativo = useRef();

    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaFornecedores, setListaFornecedores] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [selectedFornecedor, setSelectedFornecedor] = useState('');
    const [imagensPreview, setImagensPreview] = useState([]);
    const [imagensSelecionadas, setImagensSelecionadas] = useState([]);
    const [alteracao, setAlteracao] = useState(false);

    const router = useRouter();

    function carregarCategorias() {
        httpClient.get("/categorias/listar")
        .then(r => r.json())
        .then(data => setListaCategorias(data))
        .catch(console.error);
    }

    function carregarFornecedores() {
        httpClient.get("/fornecedores/listar")
        .then(r => r.json())
        .then(data => setListaFornecedores(data))
        .catch(console.error);
    }

    function formatarPreco(e) {
        // Remove tudo que não for número ou vírgula
        let valor = e.target.value.replace(/[^\d,]/g, '');
        
        // Substitui múltiplas vírgulas por uma única
        valor = valor.replace(/,+/g, ',');
        
        // Garante que só exista uma vírgula
        const partes = valor.split(',');
        if (partes.length > 2) {
            valor = partes[0] + ',' + partes[1];
        }
        
        // Limita a 2 casas decimais após a vírgula
        if (partes.length > 1 && partes[1].length > 2) {
            valor = partes[0] + ',' + partes[1].substring(0, 2);
        }
        
        e.target.value = valor;
    }

    function gravarProduto() {
        if (
            nome.current.value && descricao.current.value && id_categoria.current.value &&
            marca.current.value && preco.current.value && quantidade.current.value &&
            data_validade.current.value && id_fornecedor.current.value
        ) {
            const formData = new FormData();
            formData.append("nome", nome.current.value);
            formData.append("descricao", descricao.current.value);
            formData.append("id_categoria", id_categoria.current.value);
            formData.append("marca", marca.current.value);
            const precoFormatado = preco.current.value.replace(',', '.');
            formData.append("preco", precoFormatado);
            formData.append("quantidade", quantidade.current.value);
            formData.append("data_validade", data_validade.current.value);
            formData.append("id_fornecedor", id_fornecedor.current.value);
            for (let file of imagensSelecionadas) {
                formData.append("imagens", file);
            }
            formData.append("status_web", status_web.current.value);
            formData.append("ativo", ativo.current.value);

            httpClient.postFormData("/produtos/gravar", formData)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao gravar produto");
                    return; 
                }

                alert(resposta.msg || "Produto gravado com sucesso");
                router.push("/admin/produtos"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao gravar produto");
            });
        } else {
            alert("Preencha todos os campos!");
        }
    }

    function alterarProduto() {
        if (
            nome.current.value && descricao.current.value && id_categoria.current.value &&
            marca.current.value && preco.current.value && quantidade.current.value &&
            data_validade.current.value && id_fornecedor.current.value
        ) {
            const formData = new FormData();
            formData.append("id", produto.id);
            formData.append("nome", nome.current.value);
            formData.append("descricao", descricao.current.value);
            formData.append("id_categoria", id_categoria.current.value);
            formData.append("marca", marca.current.value);
            const precoFormatado = preco.current.value.replace(',', '.');
            formData.append("preco", precoFormatado);
            formData.append("quantidade", quantidade.current.value);
            formData.append("data_validade", data_validade.current.value);
            formData.append("id_fornecedor", id_fornecedor.current.value);
            for (let file of imagensSelecionadas) {
                formData.append("imagens", file);
            }
            formData.append("status_web", status_web.current.value);
            formData.append("ativo", ativo.current.value);

            httpClient.putFormData("/produtos/alterar", formData)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao alterar produto");
                    return; 
                }

                alert(resposta.msg || "Produto alterado com sucesso");
                router.push("/admin/produtos"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao alterar produto");
            });
        } else {
            alert("Preencha todos os campos!");
        }
    }


    function carregarPreviewImagens(e) {
        const files = Array.from(e.target.files);
        setImagensSelecionadas(prev => [...prev, ...files]);

        const novasImagens = files.map(file => URL.createObjectURL(file));
        setImagensPreview(prev => [...prev, ...novasImagens]);
    }

    function removerImagem(index) {
        setImagensPreview(prev => prev.filter((_, i) => i !== index));
        setImagensSelecionadas(prev => prev.filter((_, i) => i !== index)); 
    }

    useEffect(() => {
        carregarCategorias();
        carregarFornecedores();

        if (produto) {
            nome.current.value = produto.nome;
            descricao.current.value = produto.descricao;
            id_categoria.current.value = produto.id_categoria;
            marca.current.value = produto.marca;
            preco.current.value = produto.preco.toString().replace('.', ',');
            quantidade.current.value = produto.quantidade;
            data_validade.current.value = produto.data_validade?.substring(0, 10);
            id_fornecedor.current.value = produto.id_fornecedor;
            status_web.current.value = produto.status_web;
            ativo.current.value = produto.ativo;

            setSelectedCategoria(produto.id_categoria.toString());
            setSelectedFornecedor(produto.id_fornecedor?.toString());
            setAlteracao(true);
        }
    }, []);

    function tamanhoDescricao() {
        if(descricao.current.value.length > 999) {
            alert("Descrição muito longa!");
            descricao.current.value = descricao.current.value.slice(0, -1);
        }
    }

    return (
        <div>
            <h1>{alteracao ? "Alteração de Produto" : "Cadastro de Produto"}</h1>
            <hr />

            <div className="form-group">
                <label>Nome</label>
                <input ref={nome} className="form-control" />
            </div>

            <div className="form-group">
                <label>Descrição</label>
                <input ref={descricao} onInput={tamanhoDescricao} className="form-control" />
            </div>

            <div className="form-group">
                <label>Categoria</label>
                <select ref={id_categoria} className="form-select" value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)}>
                    <option value="">Selecione</option>
                    {listaCategorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
                </select>
            </div>

            <div className="form-group">
                <label>Marca</label>
                <input ref={marca} className="form-control" />
            </div>

            <div className="form-group">
                <label>Preço</label>
                <input 
                    ref={preco} 
                    type="text" 
                    className="form-control" 
                    onInput={formatarPreco} 
                    placeholder="0,00"
                />
            </div>

            <div className="form-group">
                <label>Quantidade</label>
                <input ref={quantidade} type="number" className="form-control" />
            </div>

            <div className="form-group">
                <label>Data de Validade</label>
                <input ref={data_validade} max={"2025-12-30"} type="date" className="form-control" />
            </div>

            <div className="form-group">
                <label>Fornecedor</label>
                <select ref={id_fornecedor} className="form-select" value={selectedFornecedor} onChange={(e) => setSelectedFornecedor(e.target.value)}>
                    <option value="">Selecione</option>
                    {listaFornecedores.map(f => <option key={f.id} value={f.id}>{f.razao_social}</option>)}
                </select>
            </div>

            <div className="form-group">
                <label>Imagem</label>
                <input onChange={carregarPreviewImagens} ref={imagens} type="file" multiple className="form-control"></input>
            </div>

            <div>
                <span>Imagens selecionadas</span>
                <br />
                <div style={{ display: 'grid', gridTemplateColumns: '150px 150px 150px', gap: '10px' }}>
                    {
                        imagensPreview.length > 0 ?
                            imagensPreview.map((value, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img width={150} src={value} alt={`preview-${index}`} />
                                    <button 
                                        onClick={() => removerImagem(index)} 
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            padding: '2px 5px'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                            :
                            <small>Nenhuma imagem selecionada</small>
                    }
                </div>
            </div>

            <div className="form-group">
                <label>Status Web</label>
                <select ref={status_web} className="form-select">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                </select>
            </div>

            <div className="form-group">
                <label>Ativo</label>
                <select ref={ativo} className="form-select">
                    <option value="1">Sim</option>
                    <option value="0">Não</option>
                </select>
            </div>

            <div style={{ marginTop: 20 }}>
                <button onClick={alteracao ? alterarProduto : gravarProduto} className="btn btn-primary">
                    {alteracao ? 'Alterar' : 'Cadastrar'}
                </button>
                <Link className="btn btn-default" href="/admin/produtos" style={{ marginLeft: 10 }}>Voltar</Link>
            </div>
        </div>
    );
}