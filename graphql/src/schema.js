const { gql } = require('apollo-server');

const typeDefs = gql`
    # Schema
    type Submission {
        id: ID!
        author: User!
        code: Code!
        upvoters: [User]!
        flagged: Boolean!
        comments: [Comment]!
    }

    type Code {
        html: String
        js: String
        css: String
    }

    type Comment {
        id: ID!
        author: User!
        body: String!
        replies: [Comment]!
    }

    type User {
        id: ID!
        github: String!
        submissions: [Submission]!
    }

    """
    Simple wrapper around our list of launches that contains a cursor to the
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
    """
    type SubmissionConnection { # add this below the Query type as an additional type.
        cursor: String!
        hasMore: Boolean!
        submissions: [Submission]!
    }

    type Query {
        submissions(
            """
            The number of results to show. Must be >= 1. Default = 20
            """
            pageSize: Int
            """
            If you add a cursor here, it will only return results _after_ this cursor
            """
            after: String
        ): SubmissionConnection!
        submission(id: ID!): Submission
        me: User
        user(github: String!): User
    }

    type Mutation {
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        cancelTrip(launchId: ID!): TripUpdateResponse!
        createSubmission(submisison: Submission!): SubmissionCreateResponse
        login(code: String): String # login token
    }

    type SubmissionCreateResponse {
        success: Boolean!
        message: String
        submissionID: [ID]
    }

`;

module.exports = typeDefs;