const moment = require('moment');

const calcularDiasCorridos = (dataInicial, dataFinal) => {
    let diasUteis = 0;
    let dataAtual = moment(dataInicial);

    while (dataAtual.isSameOrBefore(dataFinal)) {
        if (dataAtual.day() !== 0 && dataAtual.day() !== 6) {
            diasUteis++;
        }
        dataAtual.add(1, 'days');
    }

    return diasUteis;
};

class CalculadoraRecisao {
    async calcularRecisao(dto) {
        const { salarioBase, dataInicio, dataFim, avisoPrevio, hasFgts } = dto;

        // Converter as datas para objetos moment
        const inicioContrato = moment(dataInicio, 'YYYY-MM-DD');
        const fimContrato = moment(dataFim, 'YYYY-MM-DD');
        const dataRecisao = moment();

        // Calcular dias trabalhados
        const diasTrabalhados = calcularDiasCorridos(inicioContrato, fimContrato);

        // Calcular aviso prévio
        const diasAvisoPrevio = avisoPrevio ? parseInt(avisoPrevio) : 0;

        // Calcular indenização do FGTS (40%)
        const indenizacaoFgts = hasFgts ? salarioBase * 0.4 : 0;

        // Calcular férias proporcionais
        const mesesTrabalhados = moment.duration(fimContrato.diff(inicioContrato)).asMonths();
        const mesesProporcionais = Math.floor(mesesTrabalhados);
        const diasProporcionais = Math.floor((mesesTrabalhados - mesesProporcionais) * 30);
        const valorFeriasProporcionais = (salarioBase / 12) * (mesesProporcionais + diasProporcionais / 30);

        // Calcular 1/12 do 13º salário por mês trabalhado
        const valorDecimoTerceiro = (salarioBase / 12) * mesesTrabalhados;

        // Totalizar rescisão
        const totalRecisao = salarioBase + indenizacaoFgts + valorFeriasProporcionais + valorDecimoTerceiro;

        return {
            dataRecisao: dataRecisao.format('YYYY-MM-DD'),
            diasTrabalhados,
            diasAvisoPrevio,
            indenizacaoFgts,
            valorFeriasProporcionais,
            valorDecimoTerceiro,
            totalRecisao
        };
    }
}

module.exports = CalculadoraRecisao;
