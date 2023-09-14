FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /
COPY --from=build-env /out .
ENTRYPOINT ["dotnet", "API.dll"]
