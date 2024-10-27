FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Chiro.API/Chiro.API.csproj", "Chiro.API/"]
COPY ["Chiro.Application/Chiro.Application.csproj", "Chiro.Application/"]
COPY ["Chiro.Domain/Chiro.Domain.csproj", "Chiro.Domain/"]
COPY ["Chiro.Infra/Chiro.Infra.csproj", "Chiro.Infra/"]
COPY ["Chiro.Persistence/Chiro.Persistence.csproj", "Chiro.Persistence/"]
RUN dotnet restore "Chiro.API/Chiro.API.csproj"
COPY . .
WORKDIR "/src/Chiro.API"
RUN dotnet build "Chiro.API.csproj" -c ${BUILD_CONFIGURATION} -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Chiro.API.csproj" -c ${BUILD_CONFIGURATION} -o /app/publish

FROM base AS final

ARG JWT_ISSUER
ARG JWT_KEY
ARG CONNECTION_STRING

ENV JWT_ISSUER=${JWT_ISSUER}
ENV JWT_KEY=${JWT_KEY}
ENV CONNECTION_STRING=${CONNECTION_STRING}

WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "Chiro.API.dll" ]