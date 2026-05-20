const { UserService } = require('../src/userService');  

const dadosUsuarioPadrao = { 

  nome: 'Fulano de Tal', 

  email: 'fulano@teste.com', 

  idade: 25, 

}; 

describe('UserService - Suíte de Testes Limpa', () => { 

  let userService; 
  beforeEach(() => { 

    userService = new UserService(); 

    userService._clearDB(); 

  }); 

  test('deve criar um usuário com os dados informados e status ativo', () => { 

    const { nome, email, idade } = dadosUsuarioPadrao; 

    const usuarioCriado = userService.createUser(nome, email, idade); 
    expect(usuarioCriado).toMatchObject({ 

      nome, 

      email, 

      idade, 

      isAdmin: false, 

      status: 'ativo', 

    }); 

    expect(usuarioCriado.id).toBeDefined(); 

    expect(usuarioCriado.createdAt).toBeInstanceOf(Date); 

  }); 

  test('deve buscar um usuário pelo id', () => { 
    const usuarioCriado = userService.createUser( 

      dadosUsuarioPadrao.nome, 

      dadosUsuarioPadrao.email, 

      dadosUsuarioPadrao.idade 

    ); 

    const usuarioBuscado = userService.getUserById(usuarioCriado.id); 

    expect(usuarioBuscado).toEqual(usuarioCriado); 

  }); 

  test('deve retornar null ao buscar usuário inexistente', () => { 

    const idInexistente = 'id-inexistente';  

    const usuarioBuscado = userService.getUserById(idInexistente); 

    expect(usuarioBuscado).toBeNull(); 

  }); 

  test('deve desativar usuário comum', () => { 

    const usuarioComum = userService.createUser( 

      'Usuário Comum', 

      'comum@teste.com', 

      30 

    ); 

    const resultado = userService.deactivateUser(usuarioComum.id); 

    const usuarioAtualizado = userService.getUserById(usuarioComum.id); 

    expect(resultado).toBe(true); 

    expect(usuarioAtualizado.status).toBe('inativo'); 

  }); 

  test('não deve desativar usuário administrador', () => { 

    const usuarioAdmin = userService.createUser( 

      'Administrador', 

      'admin@teste.com', 

      40, 

      true 

    ); 

    const resultado = userService.deactivateUser(usuarioAdmin.id); 

    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id); 
    expect(resultado).toBe(false); 

    expect(usuarioAtualizado.status).toBe('ativo'); 

  }); 

  test('deve retornar false ao tentar desativar usuário inexistente', () => { 
    const idInexistente = 'id-inexistente'; 

    const resultado = userService.deactivateUser(idInexistente); 
    expect(resultado).toBe(false); 

  }); 

  

  test('deve gerar relatório contendo os nomes dos usuários cadastrados', () => { 
    userService.createUser('Alice', 'alice@email.com', 28); 

    userService.createUser('Bob', 'bob@email.com', 32); 

    const relatorio = userService.generateUserReport(); 
    expect(relatorio).toContain('Alice'); 

    expect(relatorio).toContain('Bob'); 

    expect(relatorio).toContain('ativo'); 

  }); 

  test('deve informar no relatório quando não houver usuários cadastrados', () => { 
    const relatorio = userService.generateUserReport(); 
    expect(relatorio).toContain('Nenhum usuário cadastrado.'); 

  }); 

  test('deve lançar erro ao tentar criar usuário menor de idade', () => { 
    const criarUsuarioMenorDeIdade = () => { 

      userService.createUser('Menor', 'menor@email.com', 17); 

    }; 
    expect(criarUsuarioMenorDeIdade).toThrow( 

      'O usuário deve ser maior de idade.' 

    ); 

  }); 

  test('deve lançar erro ao tentar criar usuário sem nome', () => { 
    const criarUsuarioSemNome = () => { 

      userService.createUser('', 'teste@email.com', 25); 

    }; 
    expect(criarUsuarioSemNome).toThrow( 

      'Nome, email e idade são obrigatórios.' 

    ); 

  }); 

  test('deve lançar erro ao tentar criar usuário sem email', () => { 
    const criarUsuarioSemEmail = () => { 

      userService.createUser('Fulano', '', 25); 

    }; 

    expect(criarUsuarioSemEmail).toThrow( 

      'Nome, email e idade são obrigatórios.' 

    ); 

  }); 

  test('deve lançar erro ao tentar criar usuário sem idade', () => { 

    const criarUsuarioSemIdade = () => { 

      userService.createUser('Fulano', 'fulano@teste.com'); 

    }; 

    expect(criarUsuarioSemIdade).toThrow( 

      'Nome, email e idade são obrigatórios.' 

    ); 

  });
  });