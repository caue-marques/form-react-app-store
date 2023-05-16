import React, { useState } from "react"

const SendReviewForm: StorefrontFunctionComponent = () => {

    const [produto, setProduto] = useState('');
    const [data, setData] = useState('');
    const [usuario, setUsuario] = useState('');
    const [nota, setNota] = useState('');
    const [comentario, setComentario] = useState('');
    const [sucesso, setSucesso] = useState(false)
    const [produtoVazio, setProdutoVazio] = useState(false)
    const [dataVazia, setDataVazia] = useState(false)
    const [usuarioVazio, setUsuarioVazio] = useState(false)
    const [notaVazia, setNotaVazia] = useState(false)

    const sendReview = async (e: any) => {
        e.preventDefault()

        if (!produto)
            setProdutoVazio(true)

        if (!data)
            setDataVazia(true)

        if (!usuario)
            setUsuarioVazio(true)

        if (!nota)
            setNotaVazia(true)
            
        if(!produto || !data || !usuario ||!nota) {
            setInterval(() => {
                setProdutoVazio(false)
                setDataVazia(false)
                setUsuarioVazio(false)
                setNotaVazia(false)
            }, 3000)

            return
        }


        await fetch(`/api/dataentities/Reviews/documents?_schema=Reviews`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                'produto': produto,
                'data': data,
                'usuario': usuario,
                'nota': nota,
                'comentario': comentario
            })
        })
            .then(data => {
                return data.json()
            })
            .then(() => {
                setSucesso(true)

                setInterval(() => {
                    setSucesso(false)
                }, 5000)
            })
    }

    return (
        <div>
            <form className="mt7 w-50 flex center flex-column items-center">
                <label className="db mb2" htmlFor="sku">Produto avaliado:</label>
                <input className="w-25 h2 ba b--black-80 db mb2" type="number" value={produto} name="sku" id="sku" placeholder="Produto" onChange={(e) => setProduto(e.target.value)} />
                {produtoVazio && <div className="f6 lh-copy tc red b">Campo Vazio</div>}

                <label className="db mb2" htmlFor="data">Data:</label>
                <input className="db mb2 w-25 h2 ba b--black-80" type="date" value={data} name="data" id="data" placeholder="Data da avaliação" onChange={(e) => setData(e.target.value)} />
                {dataVazia && <div className="f6 lh-copy tc  red b">Campo Vazio</div>}

                <label className="db mb2" htmlFor="sku">Usuário:</label>
                <input className="db mb2 w-25 h2 ba b--black-80" type="text" value={usuario} name="usuario" id="usuario" placeholder="Usuário" onChange={(e) => setUsuario(e.target.value)} />
                {usuarioVazio && <div className="f6 lh-copy tc  red b">Campo Vazio</div>}

                <label className="db mb2" htmlFor="sku">Nota:</label>
                <input className="db mb2 w-25 h2 ba b--black-80" type="number" value={nota} name="nota" id="nota" placeholder="Nota" onChange={(e) => setNota(e.target.value)} />
                {notaVazia && <div className="f6 lh-copy tc red b">Campo Vazio</div>}

                <label className="db mb2" htmlFor="sku">Comentário:</label>
                <input className="db mb2 w-25 h2 ba b--black-80" type="textarea" value={comentario} name="comentario" id="comentario" placeholder="Comentário" onChange={(e) => setComentario(e.target.value)} />

                <button type="submit" className="mt6 pointer ml5 h2 bg-green ba b--black-10" onClick={sendReview}>Enviar Review</button>
            </form>

            <div>
                {sucesso && <div className="tc mt5 blue b">Review enviada com sucesso</div>}
            </div>
        </div>

    )
};

export default SendReviewForm;