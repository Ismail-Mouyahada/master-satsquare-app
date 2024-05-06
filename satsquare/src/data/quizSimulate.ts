// Données simulées pour le modèle Quiz
const quizzesSimules = [
    {
      id: 1,
      titre: "Quiz 1",
      user_id: 1,
      categorie: "Catégorie 1",
      cree_le: new Date("2024-05-06"),
      mis_a_jour_le: new Date("2024-05-06"),
      // Relation avec le modèle Utilisateur
      utilisateur: {
        id: 1,
        pseudo: "utilisateur1",
        role_id: 1,
        mot_de_passe: "motdepasse123",
        association_id: 1,
        statut_compte: true,
        sponsor_id: 1,
        cree_le: new Date("2024-05-06"),
        mis_a_jour_le: new Date("2024-05-06"),
      },
      // Relation avec le modèle Question
      questions: [
        {
          id: 1,
          quiz_id: 1,
          texte_question: "Question 1",
          // Relation avec le modèle Réponse
          reponses: [
            {
              id: 1,
              question_id: 1,
              texte_reponse: "Réponse 1",
              est_correcte: true,
            },
            // Ajoutez d'autres réponses liées au besoin
          ],
        },
        // Ajoutez d'autres questions liées au besoin
      ],
      // Relation avec le modèle EvenementsQuiz
      evenementsQuiz: [
        {
          id: 1,
          score: 90,
          event_id: 1,
          quiz_id: 1,
          question_id: 1,
          reponse_id: 1,
          user_id: 1,
        },
        // Ajoutez d'autres données d'événements liées au besoin
      ],
    },
    // Ajoutez d'autres données simulées au besoin
  ];
  
  // Exporter toutes les données simulées
  export default quizzesSimules;
  