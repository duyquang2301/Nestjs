import { INestApplication, ValidationPipe } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { Test } from '@nestjs/testing'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'

const PORT = 3002
describe('App EndToEnd tests', () => {
  let app: INestApplication
  let prismaService: PrismaService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = appModule.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
    await app.listen(PORT)
    prismaService = app.get(PrismaService)
    await prismaService.cleanDatabase()
    pactum.request.setBaseUrl(`http://localhost:${PORT}`)
  })

  describe('Test Authentication', () => {

    describe('Register', () => {
      it('should show error with empty email', () => {
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email: '',
            password: '123456'
          })
          .expectStatus(400)
        //.inspect()
      })
      it('should show error with invalid email format', () => {
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email: 'test@gmail', //invalid email format
            password: '123456'
          })
          .expectStatus(400)
        //.inspect()
      })
      it('should show error IF password is empty', () => {
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email: 'testemail@gmail.com',
            password: '' //blank password
          })
          .expectStatus(400)
        //.inspect()
      })


      describe('Register', () => {
        it('Should Register', () => {
          return pactum.spec()
            .post(`/auth/register`)
            .withBody({
              email: 'testemail@gmail.com',
              password: '123456'
            })
            .expectStatus(201)
          // .inspect()
        })
      })

      describe('Login', () => {
        it('Should Login', () => {
          return pactum.spec()
            .post(`/auth/login`)
            .withBody({
              email: 'testemail@gmail.com',
              password: '123456'
            })
            .expectStatus(201)
            // .inspect()
            .stores('accessToken', "accessToken")
        })
      })
      describe('User', () => {
        describe('Get Detail User', () => {
          it('should get detail user', () => {
            return pactum.spec()
              .get('/users/me')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .expectStatus(200)
              .stores('userId', 'id')
              .inspect()
          })
        })
      })
    })
  })

  describe('Note', () => {
    describe('Insert Note', () => {
      it('insert first note', () => {
        return pactum.spec()
          .post('/notes')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            title: 'This is title 11',
            description: 'descriptionnnn 11',
            url: 'www.yahoo.com'
          })
          .expectStatus(201)
          .stores('nodeId01', 'id')
          .inspect()
      })
    })
  })

  afterAll(async () => {
    app.close()
  })
  it.todo('should PASS, haha 1')
})
