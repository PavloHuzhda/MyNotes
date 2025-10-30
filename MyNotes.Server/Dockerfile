# ===== BUILD STAGE =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# копіюємо тільки csproj для кешування restore
COPY *.csproj ./
RUN dotnet restore

# копіюємо решту коду
COPY . .
RUN dotnet publish -c Release -o /out /p:UseAppHost=false

# ===== RUNTIME STAGE =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .
EXPOSE 8083
ENV ASPNETCORE_URLS=http://+:8083
ENTRYPOINT ["dotnet", "MyNotes.Server.dll"]
