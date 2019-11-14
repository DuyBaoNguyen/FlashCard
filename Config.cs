using System.Collections.Generic;
using IdentityServer4.Models;

namespace FlashCard
{
    public class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResource("roles", new[] { "role" })
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("FlashCardAPI", "FlashCard API")
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            // client credentials client
            return new[]
            {
                // resource owner password grant client
                new Client
                {
                    // ClientId = "ro.client",
                    // AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                    // ClientSecrets =
                    // {
                    //     new Secret("secret".Sha256())
                    // },
                    // AllowedScopes = { "api1","roles" }

                    ClientId = "FlashCard",
                    ClientName = "FlashCard",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = { "openid", "profile", "FlashCardAPI", "roles" },
                    RedirectUris = { "https://localhost:5001/authentication/login-callback" },
                    PostLogoutRedirectUris = { "http://localhost:5001/authentication/logout-callback" },
                    AllowedCorsOrigins = { "https://localhost:5001" },
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 3600
                }
            };
        }
    }
}