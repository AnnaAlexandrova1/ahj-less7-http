const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');

const app = new Koa();

app.use(cors());
app.use(koaBody({
  urlencoded: true,
}));

// массив данных для теста
const tickets = [
  {
    id: 2145,
    name: 'Поменять краску в принтере',
    description: 'Нужно заменить краску в принтере в холле первого этажа',
    status: false,
    created: '10.09.2019 8:40',
  },
  {
    id: 2547,
    name: 'Переустановить Windows',
    description: 'Все сломалось, очень ждем!',
    status: false,
    created: '11.09.2019 8:45',
  },
  {
    id: 2354,
    name: 'Установить обновление РК-Ч12',
    description: 'Нужны права администратора, необходимо обновить программу',
    status: false,
    created: '11.09.2019 13:40',
  },
];

app.use(async (ctx) => {
  const { method, id } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;

    case 'ticketById&id':
      ctx.response.body = tickets.find((e) => e.id == id);
      return;

    case 'editTicket':
      const parseToEdit = JSON.parse(ctx.request.body);
      const editIndex = tickets.findIndex((e) => e.id == parseToEdit.id);
      tickets[editIndex] = {
        ...parseToEdit,
      };

      ctx.response.status = 200;
      return;

    case 'createTicket':
      const parse = JSON.parse(ctx.request.body);
      tickets.push({
        id: tickets[tickets.length - 1].id + 1,
        name: parse.name,
        description: parse.description,
        status: false,
        created: new Date(),
      });
      ctx.response.status = 200;
      return;

    case 'deleteTicketById':
      const ticketIndex = tickets.findIndex((e) => e.id == id);
      if (ticketIndex !== -1) {
        tickets.splice(ticketIndex, 1);
        ctx.response.body = 'Задание удалено';
      }
      ctx.response.status = 200;
      return;

    default:
      ctx.response.status = 404;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);

// массивы объектов

// const url =
