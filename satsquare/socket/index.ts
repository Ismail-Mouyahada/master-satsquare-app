import { Server, Socket } from 'socket.io';
import Manager from './roles/manager';
import Player from './roles/player';
import { abortCooldown } from './utils/cooldown';
import { getGameState } from './quiz.config';
import { PrismaClient } from '@prisma/client';
import { fetchWalletDetails } from './wallet';

let gameState: any;
const prisma = new PrismaClient();

const io = new Server({
  cors: {
    origin: '*',
  },
  path: '/ws/',
});

io.listen(5157);

io.on('connection', (socket: Socket) => {
  console.log(`User connected ${socket.id}`);


    // Handle wallet connection
    socket.on('wallet:connect', async (walletId: string) => {
      try {
        const walletDetails = await fetchWalletDetails(walletId);
        socket.emit('wallet:balance', walletDetails);
  
        // Subscribe to wallet balance updates (pseudo-code, replace with actual implementation)
        // subscribeToBalanceUpdates(walletId, (newBalance) => {
        //   io.to(socket.id).emit('wallet:balanceUpdate', { balance: newBalance });
        // });
  
        console.log('Wallet connected', walletDetails);
      } catch (error) {
        console.error('Error fetching wallet details:', error);
        socket.emit('wallet:errorMessage', 'Failed to connect to wallet.');
      }
    });
  
    // Handle receiving payments
    // socket.on('wallet:receivePayment', async (invoice: string) => {
    //   try {
    //     const paymentResult = await processPayment(invoice); // Replace with your payment processing logic
  
    //     if (paymentResult.success) {
    //       const walletDetails = await fetchWalletDetails(paymentResult.walletId);
    //       io.to(socket.id).emit('wallet:paymentReceived', {
    //         success: true,
    //         walletDetails,
    //       });
    //     } else {
    //       socket.emit('wallet:paymentFailed', {
    //         success: false,
    //         message: paymentResult.message,
    //       });
    //     }
    //   } catch (error) {
    //     console.error('Error processing payment:', error);
    //     socket.emit('wallet:errorMessage', 'Payment processing failed.');
    //   }
    // });
  

  socket.on('game:selectQuiz', async (quizId: number) => {
    try {
      gameState = await getGameState(quizId);
      socket.emit('game:quizSelected', { success: true, gameState });
    } catch (error: any) {
      socket.emit('game:errorMessage', error.message);
    }
  });

  socket.on('requestQuizzes', async () => {
    try {
      const quizzes = await prisma.quiz.findMany({
        select: {
          id: true,
          subject: true,
        },
      });
      socket.emit('quizzesList', quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      socket.emit('game:errorMessage', 'Failed to load quizzes.');
    }
  });

  socket.on('requestAssociations', async () => {
    try {
      const quizzes = await prisma.association.findMany({
        select: {
          id: true,
          valide: true,
          logoUrl: true,
          adresseEclairage: true,
        },
      });
      socket.emit('associationsList', quizzes);
    } catch (error) {
      console.error('Error fetching Associations:', error);
      socket.emit('game:errorMessage', 'Failed to load Associations.');
    }
  });

  socket.on('player:checkRoom', (roomId: string) => 
    Player.checkRoom(gameState, io, socket, roomId)
  );

  socket.on('player:join', (player: { username: string; room: string }) => 
    Player.join(gameState, io, socket, player)
  );

  socket.on('manager:createRoom', (password: string) => 
    Manager.createRoom(gameState, io, socket, password)
  );

  socket.on('manager:kickPlayer', (playerId: string) => 
    Manager.kickPlayer(gameState, io, socket, playerId)
  );

  socket.on('manager:startGame', () => 
    Manager.startGame(gameState, io, socket)
  );

  socket.on('player:selectedAnswer', (answerKey: any) => 
    Player.selectedAnswer(gameState, io, socket, answerKey)
  );

  socket.on('manager:abortQuiz', () => 
    Manager.abortQuiz(gameState, io, socket)
  );

  socket.on('manager:nextQuestion', () => 
    Manager.nextQuestion(gameState, io, socket)
  );

  socket.on('manager:showLeaderboard', () => 
    Manager.showLeaderboard(gameState, io, socket)
  );

  socket.on('wallet:connect', async (wallet: string) =>{
    console.log('Wallet connected');
    const walletdetails =  await fetchWalletDetails(wallet);

    socket.emit('wallet:balance', walletdetails);
    console.log(walletdetails);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);

    if (gameState && gameState.manager === socket.id) {
      console.log('Resetting game');
      io.to(gameState.room).emit('game:reset');
      gameState = null;

      abortCooldown();
      return;
    }

    if (gameState) {
      const playerIndex = gameState.players.findIndex((p: { id: any }) => p.id === socket.id);
      if (playerIndex !== -1) {
        const player = gameState.players.splice(playerIndex, 1)[0];
        io.to(gameState.manager).emit('manager:removePlayer', player.id);
      }
    }
  });
});
