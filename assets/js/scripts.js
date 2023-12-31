window.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://uwhn3x0mm9.execute-api.us-east-1.amazonaws.com/v1';
    // define o ano
    const ano = new Date().getFullYear();
    // document.getElementById('copy_year').innerHTML = ano;
    const form = document.getElementById('cep-form');
    // define a mascara de telefone para o campo whatsapp
    document.getElementById('ipt_cep').addEventListener('input', function (e) {
        let cep = e.target.value;
        cep = cep.replace(/\D/g, '');
        // if (cep.length <= 10) {
        //     cep = cep.replace(/(\d{2})(\d)/, '($1) $2');
        //     cep = cep.replace(/(\d{4})(\d)/, '$1-$2');
        // } else {
        //     cep = cep.replace(/(\d{2})(\d{1})(\d{4})(\d)/, '($1) $2$3-$4');
        // }
        cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = cep;
    });
    // funcao para validar o formulário
    function validateForm() {
        let valid = true;
        // valida se os campos obrigatórios foram informados
        const requiredFields = form.querySelectorAll('input[required]');
        requiredFields.forEach(function (field) {
            const parentElement = field.closest('div');
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('is-invalid');
                parentElement.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
                parentElement.classList.remove('is-invalid');
            }
        });
        // valida se existe algum pattern
        const patternFields = form.querySelectorAll('input[pattern]');
        patternFields.forEach(function (field) {
            const parentElement = field.closest('div');
            if (!field.value.match(field.getAttribute('pattern'))) {
                valid = false;
                field.classList.add('is-invalid');
                parentElement.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
                parentElement.classList.remove('is-invalid');
            }
        });
        return valid;
    }
    // funcao para exibir mensagem de erro
    function setMsgError(msg) {
        document.getElementById('show_error').classList.remove('d-none');
        document.getElementById('show_error').classList.add('d-block');
        document.getElementById('msg_erro').innerHTML = msg;
    }
    // funcao para colocar o formulario em carregando
    function setLoading(status) {
        if (status) {
            document.getElementById('btn_submit').setAttribute('disabled', 'true');
            form.querySelectorAll('input').forEach((elem) => {
                elem.setAttribute('readonly', 'true');
            });
        } else {
            document.getElementById('btn_submit').removeAttribute('disabled');
            form.querySelectorAll('input').forEach((elem) => {
                elem.removeAttribute('readonly');
            });
        }
    }
    // submit do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // remove classe de erro
        document.getElementById('show_error').classList.remove('d-block');
        document.getElementById('show_error').classList.add('d-none');
        // valida o formulário
        const valid = validateForm();
        if (valid) {
            // busca os valores do formulario
            let values = {}
            form.querySelectorAll('input, textarea').forEach((elem) => {
                if (elem.hasAttribute('name')) {
                    values[elem.name] = elem.value;
                }
            });
            // define o payload da consulta
            let cep = values.cep;
            const apiConfig = {
                method: 'GET',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': '*'
                },
                mode: 'cors'
            }
            setLoading(true);
            // faz a consulta
            fetch(apiURL + `?cep=${cep}`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        loopCep(data);
                    } else {
                        document.getElementById('show_error').classList.remove('d-none');
                        document.getElementById('show_error').classList.add('d-block');
                        document.getElementById('msg_erro').innerHTML = 'Ocorreu algum problema ou CEP não foi encontrado!';
                    }
                    setLoading(false);
                    form.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    setMsgError('Erro ao consultar CEP.');
                    setLoading(false);
                });

        }
    });
    loopCeps = document.getElementById('loopCeps');
});

function loopCep(data) {
    if (document.getElementById('cepZero')) {
        let cepZero = document.getElementById('cepZero');
        cepZero.classList.add('d-none');
    }
    let div = document.createElement('div');
    div.classList.add('cep-card', 'p-2', 'rounded-3', 'mb-2', 'mx-2', 'shadow');
    div.innerHTML = `
    <div>
        <small class="fw-bold">Cidade: </small>${data.localidade}
    </div>
    <div>
        <small class="fw-bold">UF: </small>${data.uf}
    </div>
    <div>
        <small class="fw-bold">CEP: </small>${data.cep}
    </div>
    <div>
        <small class="fw-bold">DDD: </small>${data.ddd}
    </div>`;
    loopCeps.appendChild(div);
}